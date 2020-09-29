import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, ActivityIndicator, TextInput, Linking, Modal, Dimensions, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';

export default class Settings extends React.Component {

  constructor(props) {
    super(props),
    this.state = {
      view_change_firstname: false,
      view_change_lastname: false,
      view_change_email: false,
      view_change_phone:false,
      user_info:null,
      modalTOU:false
    }
  }

  componentDidMount() {
    this._get_user_info();
    console.log(this.state.modalTOU)
  }

  _export_data_from_user = () => {
  
  }

  _tou = () => {
  
  }

  _about = () => {
  
  }

  _send  = async () => {
    try {
        const response = await fetch('https://api.wellcheck.fr/updateinfos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token':global.infos.api_token,
                'usrtoken':global.infos.user_token,
            },
            body: JSON.stringify({
              "firstname":this.state.user_info['firstname'] == "Enter your first name" ? "" : this.state.user_info['firstname'],
              "lastname":this.state.user_info['lastname'] == "Enter your last name" ? "" : this.state.user_info['lastname'],
              "phone":this.state.user_info['phone'] == "Enter your phone number" ? "" : this.state.user_info['phone'],
            })
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({error:true})
        }
        if (responseJson["succes"] == true) {
          this.forceUpdate()              
        }
    }
    catch (error) {
      console.log(error)
        this.setState({
            error:'Cann\'t connect to server'
        })
    }        
  }

  _get_user_info= async () => {
    try {
        const response = await fetch('https://api.wellcheck.fr/infos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token':global.infos.api_token,
                'usrtoken':global.infos.user_token,
            },
        });
        const responseJson = await response.json();
        if (responseJson["succes"] == false) {
            this.setState({error:true})
        }
        if (responseJson["succes"] == true) {
            this.setState({user_info:responseJson['data']})
            if (responseJson['data']['firstname'] == null)
              this.state.user_info['firstname'] = "Enter your first name"
            if (responseJson['data']['lastname'] == null)
              this.state.user_info['lastname'] = "Enter your last name"
            if (responseJson['data']['phone'] == null)
              this.state.user_info['phone'] = "Enter your phone number"
        }
    }
    catch (error) {
        this.setState({
            error:'Cann\'t connect to server'
        })
    }        
  }

  openModalTOU(){
    this.setState({modalTOU:true})
  }

  closeModalTOU(){
    this.setState({modalTOU:false})
  }

  render (){

    let save;
    if (this.state.view_change_email || this.state.view_change_firstname || this.state.view_change_lastname || this.state.view_change_phone) {
      save = <View style={{alignItems:'center', justifyContent:'center', marginTop:30 }}><TouchableOpacity style={{ borderRadius:10, alignItems:'center', justifyContent:'center', width:200,  height:40, backgroundColor:'#1C90FF'}} onPress={() => this._send()}><Text style={{ fontSize:10, color:'white' }}>Send</Text></TouchableOpacity></View>
    }

    return (
      <SafeAreaView style={{ marginTop: Constants.statusBarHeight, }}>
        <ScrollView>
          <View style={{ justifyContent:'center', alignItems:'center', height:200 }}>
            <Image source={require('../assets/images/logo/logo_params_gris_80.png')} style={ styles.logoImage } />
          </View>
          {this.state.user_info?
            <View style={{marginBottom:20}}>
              <View style={{ justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize: 30 }}>{this.state.user_info['firstname'] == "Enter your first name" || this.state.user_info['lastname'] == "Enter your last name" ? "Profile" : this.state.user_info['firstname'] + " " + this.state.user_info['lastname']}</Text>
                <Text style={{ fontSize: 10 }}>Creation date : {new Date(this.state.user_info['date'] / 1000).toLocaleDateString("en-US")}</Text>
              </View>
              <KeyboardAvoidingView style={{ marginLeft:30, marginRight:30 }} behavior="padding">
                <View style={{marginTop:"10%"}}>
                  <View style={styles.viewScrollViewName}>
                    <Image source={require('../assets/images/profil/avatar.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_firstname ? this.setState({view_change_firstname:false}) : this.setState({view_change_firstname:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> First name</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_firstname != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['firstname'] = text} placeholder={" " + this.state.user_info['firstname']}/>
                        </View>
                      :
                        null
                      }
                      <TouchableOpacity onPress={() => this.state.view_change_lastname ? this.setState({view_change_lastname:false}) : this.setState({view_change_lastname:true})}>
                        <View style={{flexDirection:"row", borderTopWidth:1, borderColor:"#e8e8e8"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Last name</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_lastname != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['lastname'] = text} placeholder={" " + this.state.user_info['lastname']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  <View style={styles.viewScrollViewProfile}>
                    <Image source={require('../assets/images/profil/arobase.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_email ? this.setState({view_change_email:false}) : this.setState({view_change_email:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Email</Text>
                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_email != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['email'] = text} placeholder={" " + this.state.user_info['email']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  <View style={styles.viewScrollViewProfile}>
                    <Image source={require('../assets/images/profil/phone.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                    <View style={{alignItems:"stretch", width:"80%"}}>
                      <TouchableOpacity onPress={() => this.state.view_change_phone ? this.setState({view_change_phone:false}) : this.setState({view_change_phone:true})}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{ fontSize: 20, color: '#636363' }}> Phone number</Text>

                        </View>
                      </TouchableOpacity>
                      { this.state.view_change_phone != false ?
                        <View style={{flexDirection:"row", backgroundColor:"white", marginBottom:2, borderRadius:7}}>
                          <TextInput style={{width:"80%"}}  onChangeText={(text) => this.state.user_info['phone'] = text} placeholder={" " + this.state.user_info['phone']}/>
                        </View>
                      :
                        null
                      }
                    </View>
                  </View>


                  { save }


                  <View style={{marginTop:"20%"}}>
                    <View style={styles.viewScrollViewName}>
                      <Image source={require('../assets/images/profil/data.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                      <View style={{alignItems:"stretch", width:"80%"}}>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row", borderBottomWidth:1, borderColor:"#e8e8e8"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }}> Export my data</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row"}}>
                              <Text style={{ fontSize: 20, color: '#636363' }}> Delete my data</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.viewScrollViewName}>
                      <Image source={require('../assets/images/profil/test1_last_logo.png')} style={{height:30, width:30, marginLeft:"5%", marginRight:"5%"}}/>
                      <View style={{alignItems:"stretch", width:"80%"}}>
                        <TouchableOpacity onPress={() => console.log('on ouvre la modal')}>
                          <View style={{flexDirection:"row", borderBottomWidth:1, borderColor:"#e8e8e8"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }}> Terms of Use</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <View style={{flexDirection:"row"}}>
                            <Text style={{ fontSize: 20, color: '#636363' }} onPress={() => Linking.openURL('https://wellcheck.co')}> About WellCheck</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            :
            <View style={{marginTop:"20%"}}>
              <ActivityIndicator size="large" color="#0098EB" />
            </View>
          }


        {/* <Modal isVisible={this.state.modalTOU} onBackdropPress={()=>this.closeModalTOU()} style={{ backgroundColor:'red', borderRadius:30 }}>
          <View style={{ alignItems:'center', justifyContent: 'center', backgroundColor:"red"}}>
            <Text>TOTO</Text> */}
            {/* <WebView html={'<h2>Welcome to WellCheck</h2>\
    <p>These terms and conditions outline the rules and regulations for the use of WellCheck\'s Website.</p> <br /> \
    <span style="text-transform: capitalize;"> WellCheck</span> is located at:<br /> \
    <address>10 Rue du Louvres Paris <br />75001 - Paris , France<br />\
    </address>\
    <p>By accessing this website we assume you accept these terms and conditions in full. Do not continue to use WellCheck\'s website \
    if you do not accept all of the terms and conditions stated on this page.</p>\
    <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice\
    and any or all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website\
    and accepting the Company\'s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers\
    to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the Client\
    or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake\
    the process of our assistance to the Client in the most appropriate manner, whether by formal meetings\
    of a fixed duration, or any other means, for the express purpose of meeting the Client\'s needs in respect\
    of provision of the Company\'s stated services/products, in accordance with and subject to, prevailing law\
    of France. Any use of the above terminology or other words in the singular, plural,\
    capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p><h2>Cookies</h2>\
    <p>We employ the use of cookies. By using WellCheck\'s website you consent to the use of cookies \
    in accordance with WellCheck\'s privacy policy.</p><p>Most of the modern day interactive web sites\
    use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site\
    to enable the functionality of this area and ease of use for those people visiting. Some of our \
    affiliate / advertising partners may also use cookies.</p><h2>License</h2>\
    <p>Unless otherwise stated, WellCheck and/or it\'s licensors own the intellectual property rights for\
    all material on WellCheck. All intellectual property rights are reserved. You may view and/or print\
    pages from https://wellcheck.fr for your own personal use subject to restrictions set in these terms and conditions.</p>\
    <p>You must not:</p>\
    <ol>\
        <li>Republish material from https://wellcheck.fr</li>\
        <li>Sell, rent or sub-license material from https://wellcheck.fr</li>\
        <li>Reproduce, duplicate or copy material from https://wellcheck.fr</li>\
    </ol>\
    <p>Redistribute content from WellCheck (unless content is specifically made for redistribution).</p>\
<h2>Hyperlinking to our Content</h2>\
    <ol>\
        <li>The following organizations may link to our Web site without prior written approval:\
            <ol>\
            <li>Government agencies;</li>\
            <li>Search engines;</li>\
            <li>News organizations;</li>\
            <li>Online directory distributors when they list us in the directory may link to our Web site in the same\
                manner as they hyperlink to the Web sites of other listed businesses; and</li>\
            <li>Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls,\
                and charity fundraising groups which may not hyperlink to our Web site.</li>\
            </ol>\
        </li>\
    </ol>\
    <ol start="2">\
        <li>These organizations may link to our home page, to publications or to other Web site information so long\
            as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or\
            approval of the linking party and its products or services; and (c) fits within the context of the linking\
            party\'s site.\
        </li>\
        <li>We may consider and approve in our sole discretion other link requests from the following types of organizations:\
            <ol>\
                <li>commonly-known consumer and/or business information sources such as Chambers of Commerce, American\
                    Automobile Association, AARP and Consumers Union;</li>\
                <li>dot.com community sites;</li>\
                <li>associations or other groups representing charities, including charity giving sites,</li>\
                <li>online directory distributors;</li>\
                <li>internet portals;</li>\
                <li>accounting, law and consulting firms whose primary clients are businesses; and</li>\
                <li>educational institutions and trade associations.</li>\
            </ol>\
        </li>\
    </ol>\
    <p>We will approve link requests from these organizations if we determine that: (a) the link would not reflect\
    unfavorably on us or our accredited businesses (for example, trade associations or other organizations\
    representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed\
    to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from\
    the visibility associated with the hyperlink outweighs the absence of WellCheck; and (d) where the\
    link is in the context of general resource information or is otherwise consistent with editorial content\
    in a newsletter or similar product furthering the mission of the organization.</p>\
    <p>These organizations may link to our home page, to publications or to other Web site information so long as\
    the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval\
    of the linking party and it products or services; and (c) fits within the context of the linking party\'s\
    site.</p>\
    <p>If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,\
    you must notify us by sending an e-mail to <a href="mailto:hello@wellcheck.co" title="send an email to hello@wellcheck.co">hello@wellcheck.co</a>.\
    Please include your name, your organization name, contact information (such as a phone number and/or e-mail\
    address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site,\
    and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.</p>\
    <p>Approved organizations may hyperlink to our Web site as follows:</p>\
    <ol>\
        <li>By use of our corporate name; or</li>\
        <li>By use of the uniform resource locator (Web address) being linked to; or</li>\
        <li>By use of any other description of our Web site or material being linked to that makes sense within the\
            context and format of content on the linking party\'s site.</li>\
    </ol>\
    <p>No use of WellCheck\'s logo or other artwork will be allowed for linking absent a trademark license\
    agreement.</p>\
<h2>Iframes</h2>\
    <p>Without prior approval and express written permission, you may not create frames around our Web pages or\
    use other techniques that alter in any way the visual presentation or appearance of our Web site.</p>\
<h2>Reservation of Rights</h2>\
    <p>We reserve the right at any time and in its sole discretion to request that you remove all links or any particular\
    link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also\
    reserve the right to amend these terms and conditions and its linking policy at any time. By continuing\
    to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.</p>\
<h2>Removal of links from our website</h2>\
    <p>If you find any link on our Web site or any linked web site objectionable for any reason, you may contact\
    us about this. We will consider requests to remove links but will have no obligation to do so or to respond\
    directly to you.</p>\
    <p>Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness\
    or accuracy; nor do we commit to ensuring that the website remains available or that the material on the\
    website is kept up to date.</p>\
<h2>Content Liability</h2>\
    <p>We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify\
    and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any\
    page on your Web site or within any context containing content or materials that may be interpreted as\
    libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or\
    other violation of, any third party rights.</p>\
<h2>Disclaimer</h2>\
    <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:</p>\
    <ol>\
    <li>limit or exclude our or your liability for death or personal injury resulting from negligence;</li>\
    <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>\
    <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>\
    <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>\
    </ol>\
    <p>The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a)\
    are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or\
    in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort\
    (including negligence) and for breach of statutory duty.</p>\
    <p>To the extent that the website and the information and services on the website are provided free of charge,\
    we will not be liable for any loss or damage of any nature.</p>\
<h2></h2>\
    <p></p>\
<h2>Credit & Contact Information</h2>\
    <p>This Terms and conditions page was created at <a style="color:inherit;text-decoration:none;cursor:text;"\
        href="https://termsandconditionstemplate.com/generate/">termsandconditionstemplate.com</a> generator. If you have\
    any queries regarding any of our terms, please contact us.</p>'} /> */}
          {/* </View>
        </Modal> */}


        </ScrollView>
      </SafeAreaView>
    )
  };
};


const styles = StyleSheet.create({

  logoImage:{
    height: 100,
    width: 100,
  },

  viewScrollViewSettings:{
    marginTop:10,
    backgroundColor:'#e6e6e6',
    borderRadius:10
  },

  viewScrollViewName:{
    marginTop:10,
    backgroundColor:'#f0f0f0',
    borderRadius:8,
    borderWidth:2,
    borderColor:'#e8e8e8',
    alignItems:'center',
    flexDirection:"row"
  },

  viewScrollViewProfile:{
    marginTop:10,
    backgroundColor:'#f0f0f0',
    borderRadius:8,
    borderWidth:2,
    borderColor:'#e8e8e8',
    alignItems:'center',
    flexDirection:"row"
  },
})
